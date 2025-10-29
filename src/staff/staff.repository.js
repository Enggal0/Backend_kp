import prisma from '../config/database.js';

// Function to create a new staff member.
// Can only be done by a USER from the same unit.
const createStaff = async (staffData, creatorId) => {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: {
      role: true,
      unit_kerja_id: true,
    },
  });

  if (!creator || creator.role !== 'USER') {
    throw new Error('Unauthorized. Only users with the USER role can create staff.');
  }

  // Check if the NIPM is already in use by another staff member.
  const existingStaff = await prisma.staff.findUnique({
    where: { nipm: staffData.nipm },
  });

  if (existingStaff) {
    throw new Error('NIPM is already registered for another staff member.');
  }

  const newStaff = await prisma.staff.create({
    data: {
      nama: staffData.nama,
      nipm: staffData.nipm,
      status_kepegawaian: staffData.status_kepegawaian,
      email: staffData.email,
      unit_kerja_id: creator.unit_kerja_id, // Assign the same work unit as the creator
      createdByUserId: creatorId, // Explicitly link the creator
    },
  });
  return newStaff;
};

// Function to find all staff members.
// Filters staff based on the current user's work unit.
const findAllStaff = async (userData, currentUserId) => {
  const size = Number(userData.per_page) || 10;  // bisa dikontrol dari query param
  const page = Number(userData.page) || 1;
  const skip = (page - 1) * size;

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { role: true, unit_kerja_id: true },
  });

  if (!currentUser) {
    throw new Error('User not found.');
  }

  const filters = [];
  if (currentUser.role === 'USER') {
    filters.push({ unit_kerja_id: currentUser.unit_kerja_id });
  }

  if (userData.nama) filters.push({ nama: { contains: userData.nama } });
  if (userData.nipm) filters.push({ nipm: { contains: userData.nipm } });
  if (userData.status_kepegawaian) {
    const statusKepegawaian =
      userData.status_kepegawaian.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    filters.push({ status_kepegawaian: statusKepegawaian });
  }

  // Ambil data staff sesuai halaman
  const staff = await prisma.staff.findMany({
    where: { AND: filters },
    orderBy: { nama: 'asc' },
    select: {
      id: true,
      nama: true,
      nipm: true,
      status_kepegawaian: true,
      unit_kerja: { select: { nama: true } },
    },
    take: size,
    skip,
  });

  // Total item
  const totalItems = await prisma.staff.count({ where: { AND: filters } });

  return {
    data: staff,
    current_page: page,
    per_page: size,
    total: totalItems,
    last_page: Math.ceil(totalItems / size),
  };
};

// Function to find a staff member by ID.
// Verifies that the user has permission to view the staff member.
const findStaffById = async (id, currentUserId) => {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      unit_kerja: {
        select: {
          nama: true,
        },
      },
    },
  });

  if (!staff) {
    throw new Error('Staff not found.');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      role: true,
      unit_kerja_id: true,
    },
  });

  if (!currentUser || (currentUser.role === 'USER' && staff.unit_kerja_id !== currentUser.unit_kerja_id)) {
    throw new Error('Access denied. You do not have permission to view this staff member\'s data.');
  }

  return staff;
};

// Function to update a staff member.
// Only a USER from the same work unit can update.
const updateStaff = async (id, staffData, currentUserId) => {
  const staffToUpdate = await prisma.staff.findUnique({
    where: { id },
    select: {
      unit_kerja_id: true,
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      role: true,
      unit_kerja_id: true,
    },
  });

  if (!staffToUpdate) {
    throw new Error('Staff not found.');
  }

  if (!currentUser || currentUser.role !== 'USER' || staffToUpdate.unit_kerja_id !== currentUser.unit_kerja_id) {
    throw new Error('Access denied. You do not have permission to edit this staff member.');
  }

  const updatedStaff = await prisma.staff.update({
    where: { id },
    data: {
      nama: staffData.nama,
      nipm: staffData.nipm,
      status_kepegawaian: staffData.status_kepegawaian,
      email: staffData.email,
    },
  });
  return updatedStaff;
};

// Function to delete a staff member.
// Only a USER from the same work unit can delete.
const deleteStaff = async (id, currentUserId) => {
  const staffToDelete = await prisma.staff.findUnique({
    where: { id },
    select: {
      unit_kerja_id: true,
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      role: true,
      unit_kerja_id: true,
    },
  });

  if (!staffToDelete) {
    throw new Error('Staff not found.');
  }

  if (!currentUser || currentUser.role !== 'USER' || staffToDelete.unit_kerja_id !== currentUser.unit_kerja_id) {
    throw new Error('Access denied. You do not have permission to delete this staff member.');
  }

  const deletedStaff = await prisma.staff.delete({
    where: { id },
  });
  return deletedStaff;
};

export {
  createStaff,
  findAllStaff,
  findStaffById,
  updateStaff,
  deleteStaff,
};
