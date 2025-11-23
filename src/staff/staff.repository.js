import prisma from '../config/database.js';
import bcrypt from 'bcrypt';

// Function to create a new staff member. Creates a `User` then a `Staff` row linked to it.
const createStaff = async (staffData, creatorId) => {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: {
      role: true,
      unit_kerja_id: true,
    },
  });

  if (!creator || !['SUPER_ADMIN', 'ADMIN_PDM', 'SCHOOL_ADMIN'].includes(creator.role)) {
    throw new Error('Unauthorized. Only users with the SUPER_ADMIN, ADMIN_PDM, or SCHOOL_ADMIN role can create staff.');
  }

  // Check if the NIPM is already in use by another user.
  const existingUser = await prisma.user.findUnique({ where: { nipm: staffData.nipm } });
  if (existingUser) {
    throw new Error('NIPM is already registered for another staff member.');
  }

  // Create the User account first
  const defaultPassword = bcrypt.hashSync('12345678', 10);
  const newUser = await prisma.user.create({
    data: {
      nama: staffData.nama,
      nipm: staffData.nipm,
      status_kepegawaian: staffData.status_kepegawaian,
      email: staffData.email,
      unit_kerja_id: staffData.unit_kerja_id,
      password: defaultPassword,
      role: 'USER',
      img_url: staffData.img_url || null,
    },
  });

  // Create the Staff record linked to the User
  const staff = await prisma.staff.create({
    data: {
      user_id: newUser.id,
      unit_kerja_id: staffData.unit_kerja_id,
      jenis_jabatan: staffData.jenis_jabatan || 'GURU',
      status_kepegawaian: staffData.status_kepegawaian,
      createdByUserId: creatorId,
      tahun_jabatan_mulai: staffData.tahun_jabatan_mulai || null,
      tahun_jabatan_selesai: staffData.tahun_jabatan_selesai || null,
      img_url: staffData.img_url || null,
    },
  });

  // return combined view
  return { user: newUser, staff };
};

// Function to find all staff members.
// Filters staff based on the current user's work unit.
const findAllStaff = async (userData, currentUserId) => {
  const size = Number(userData.per_page) || 10;
  const page = Number(userData.page) || 1;
  const skip = (page - 1) * size;

  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, select: { role: true, unit_kerja_id: true } });
  if (!currentUser) throw new Error('User not found.');

  const filters = {};
  // only show staff in same unit for plain USER role
  if (currentUser.role === 'USER') filters.unit_kerja_id = currentUser.unit_kerja_id;
  if (userData.status_kepegawaian) {
    const statusKepegawaian = userData.status_kepegawaian.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    filters.status_kepegawaian = statusKepegawaian;
  }

  // name / nipm filters apply to related user
  const relationalFilters = {};
  if (userData.nama) relationalFilters.user = { nama: { contains: userData.nama } };
  if (userData.nipm) relationalFilters.user = { ...(relationalFilters.user || {}), nipm: { contains: userData.nipm } };

  const whereClause = {
    AND: [
      filters,
      relationalFilters,
      { user: { role: 'USER' } },
    ],
  };

  const staff = await prisma.staff.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, nama: true, nipm: true, img_url: true } },
      unit_kerja: { select: { nama: true } },
    },
    take: size,
    skip,
  });

  const totalItems = await prisma.staff.count({ where: whereClause });

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
      user: { select: { id: true, nama: true, nipm: true, email: true, img_url: true } },
      unit_kerja: { select: { nama: true } },
    },
  });

  if (!staff) throw new Error('Staff not found.');

  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, select: { role: true, unit_kerja_id: true } });
  if (!currentUser) throw new Error('User not found.');

  if (currentUser.role === 'USER' && staff.unit_kerja_id !== currentUser.unit_kerja_id) {
    throw new Error('Access denied. You do not have permission to view this staff member\'s data.');
  }

  return staff;
};

// Function to update a staff member.
// Only a USER from the same work unit can update.
const updateStaff = async (id, staffData, currentUserId) => {
  const staffToUpdate = await prisma.staff.findUnique({ where: { id }, select: { unit_kerja_id: true } });
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, select: { role: true, unit_kerja_id: true } });

  if (!staffToUpdate) throw new Error('Staff not found.');
  if (!currentUser || currentUser.role !== 'USER' || staffToUpdate.unit_kerja_id !== currentUser.unit_kerja_id) {
    throw new Error('Access denied. You do not have permission to edit this staff member.');
  }

  const updatedStaff = await prisma.staff.update({
    where: { id },
    data: {
      jenis_jabatan: staffData.jenis_jabatan,
      status_kepegawaian: staffData.status_kepegawaian,
      tahun_jabatan_mulai: staffData.tahun_jabatan_mulai || null,
      tahun_jabatan_selesai: staffData.tahun_jabatan_selesai || null,
      img_url: staffData.img_url || null,
    },
    include: { user: true },
  });

  // Also update the linked User's basic info if provided
  if (staffData.nama || staffData.nipm || staffData.email) {
    await prisma.user.update({ where: { id: updatedStaff.user_id }, data: { nama: staffData.nama, nipm: staffData.nipm, email: staffData.email } });
  }

  return updatedStaff;
};

// Function to delete a staff member.
// Only a USER from the same work unit can delete.
const deleteStaff = async (id, currentUserId) => {
  const staffToDelete = await prisma.staff.findUnique({ where: { id }, select: { unit_kerja_id: true, user_id: true } });
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId }, select: { role: true, unit_kerja_id: true } });

  if (!staffToDelete) throw new Error('Staff not found.');
  if (!currentUser || currentUser.role !== 'USER' || staffToDelete.unit_kerja_id !== currentUser.unit_kerja_id) {
    throw new Error('Access denied. You do not have permission to delete this staff member.');
  }

  // Delete staff row and the linked user account
  await prisma.staff.delete({ where: { id } });
  const deletedUser = await prisma.user.delete({ where: { id: staffToDelete.user_id } });
  return { deletedUserId: deletedUser.id };
};

export {
  createStaff,
  findAllStaff,
  findStaffById,
  updateStaff,
  deleteStaff,
};
