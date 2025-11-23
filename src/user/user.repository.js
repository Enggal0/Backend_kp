import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import accessToken from '../utils/jwt.js';

const findAllUsers = async (userData) => {
  const size = 10;
  const skip = (userData.page - 1) * size;

  const filters = [];

  // If user is SCHOOL_ADMIN, filter by their unit_kerja_id
  if (userData.userRole === 'SCHOOL_ADMIN' && userData.userUnitKerjaId) {
    filters.push({
      unit_kerja_id: userData.userUnitKerjaId,
    });
  }

  if (userData.nama) {
    filters.push({
      nama: {
        contains: userData.nama,
      },
    });
  }
  if (userData.nipm) {
    filters.push({
      nipm: {
        contains: userData.nipm,
      },
    });
  }
  if (userData.status_kepegawaian) {
    // Konversi ke Sentence Case
    let statusKepegawaian = userData.status_kepegawaian.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

    // Handle exception for "Tidak Tetap"
    if (statusKepegawaian === 'Tidak tetap' || statusKepegawaian === 'Tidak_tetap') {
      statusKepegawaian = 'Tidak_Tetap';
    }
    filters.push({
      status_kepegawaian: statusKepegawaian,
    });
  }
  if (userData.unit_kerja) {
    filters.push({
      unit_kerja: {
        nama: {
          contains: userData.unit_kerja,
        },
      },
    });
  }
  if (userData.jabatan) {
    filters.push({
      titles: {
        some: {
          jabatan: {
            contains: userData.jabatan,
          },
        },
      },
    });
  }

  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
      AND: filters,
    },
    orderBy: {
      nama: 'asc',
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      status_kepegawaian: true,
      unit_kerja_id: true,
      unit_kerja: {
        select: {
          nama: true,
        },
      },
      titles: {
        select: {
          jabatan: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    take: size,
    skip,
  });

  const totalItems = await prisma.user.count({
    where: {
      role: 'USER',
      AND: filters,
    },
  });

  return {
    users,
    page: userData.page,
    total_item: totalItems,
    total_page: Math.ceil(totalItems / size),
  };
};

const findChart = async () => {
  const jumlahLakiLaki = await prisma.user.count({
    where: {
      role: 'USER',
      profile: {
        jenis_kelamin: 'Laki_Laki',
      },
    },
  });

  const jumlahPerempuan = await prisma.user.count({
    where: {
      role: 'USER',
      profile: {
        jenis_kelamin: 'Perempuan',
      },
    },
  });

  const ChartSD = await prisma.user.count({
    where: {
      role: 'USER',
      unit_kerja: {
        nama: {
          startsWith: 'SD',
        },
      },
    },
  });
  const ChartSMP = await prisma.user.count({
    where: {
      role: 'USER',
      unit_kerja: {
        nama: {
          startsWith: 'SMP',
        },
      },
    },
  });
  const CharTSMA = await prisma.user.count({
    where: {
      role: 'USER',
      unit_kerja: {
        nama: {
          startsWith: 'SMA',
        },
      },
    },
  });

  const totalPegawaiTetap = await prisma.user.count({
    where: {
      role: 'USER',
      status_kepegawaian: 'Tetap',
    },
  });
  const totalPegawaiKontrak = await prisma.user.count({
    where: {
      role: 'USER',
      status_kepegawaian: 'Kontrak',
    },
  });
  const totalPegawaiTidakTetap = await prisma.user.count({
    where: {
      role: 'USER',
      status_kepegawaian: 'Tidak_Tetap',
    },
  });

  const currentYear = new Date().getFullYear();

  console.log(currentYear);

  // const countEducationSD = await prisma.user.findMany({
  //   select: {
  //     _count: {
  //       select: {
  //         educations: {
  //           where: {
  //             tahun_lulus:
  //           }
  //         }
  //       }
  //     }
  //   }
  // });

  // const totalItems = jumlahLakiLaki + jumlahPerempuan;
  // const persentaseLakiLaki = (jumlahLakiLaki / totalItems) * 100;
  // const persentasePerempuan = (jumlahPerempuan / totalItems) * 100;

  return {
    Jenis_Kelamin: {
      laki_laki: jumlahLakiLaki,
      perempuan: jumlahPerempuan,
    },
    Unit_Kerja: {
      SD: ChartSD,
      SMP: ChartSMP,
      SMA: CharTSMA,
    },
    Status_Kepegawaian: {
      tetap: totalPegawaiTetap,
      tidak_tetap: totalPegawaiTidakTetap,
      kontrak: totalPegawaiKontrak,
    },
    // educations: {
    //   SD: countEducationSD,
    // },
  };
};

const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      unit_kerja: {
        select: {
          nama: true,
        },
      },
    },
  });
  return user;
};

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      unit_kerja: {
        select: {
          nama: true,
        },
      },
    },
  });
  return user;
};

const findDetailUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      email: true,
      status_kepegawaian: true,
      img_url: true,
      unit_kerja_id: true,
      unit_kerja: {
        select: {
          nama: true,
        },
      },
      profile: {
        select: {
          alamat: true,
          tempat_lahir: true,
          tanggal_lahir: true,
          jenis_kelamin: true,
          nomor_telepon: true,
          agama: true,
        },
      },
      titles: {
        select: {
          jabatan: true,
        },
        take: 1,
        orderBy: {
          tmt: 'desc',
        },
      },
      staff: {
        select: {
          jenis_jabatan: true,
          tahun_jabatan_mulai: true,
          tahun_jabatan_selesai: true,
          status_kepegawaian: true,
          unit_kerja_id: true,
        },
      },
    },
  });
  return user;
};
const findPasswordUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

const insertUser = async (userData) => {
  const hashPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      nama: userData.nama,
      nipm: userData.nipm,
      status_kepegawaian: userData.status_kepegawaian,
      password: hashPassword,
      // role: userData.role,
      unit_kerja_id: userData.unit_kerja_id,
      img_url: userData.img_url,
      profile: {
        create: {},
      },
      // Staff-related fields are handled in `Staff` model
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      email: true,
      status_kepegawaian: true,
      unit_kerja: {
        select: {
          nama: true,
        },
      },
      img_url: true,
      profile: {
        select: {
          user_id: true,
        },
      },
    },
  });

  // If jenis_jabatan was provided by admin creation, set staff-related fields on the User
  try {
    if (userData.jenis_jabatan && userData.createdByUserId) {
      // Create a Staff row linked to this user instead of setting fields on User
      const staffPayload = {
        user_id: user.id,
        unit_kerja_id: userData.unit_kerja_id,
        jenis_jabatan: userData.jenis_jabatan,
        status_kepegawaian: userData.status_kepegawaian,
        createdByUserId: userData.createdByUserId,
        tahun_jabatan_mulai: userData.tahun_jabatan_mulai || null,
        tahun_jabatan_selesai: userData.tahun_jabatan_selesai || null,
      };
      // debug log the staff payload
      console.log('Creating staff for user:', user.id, JSON.stringify(staffPayload));
      await prisma.staff.create({ data: staffPayload });
    }
  } catch (err) {
    // Log error but don't fail the whole user creation
    console.error('Failed to set staff-related fields for new user:', err.message, err.stack);
  }

  return user;
};

const findUserCurrent = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      email: true,
      role: true,
      img_url: true,
      unit_kerja_id: true,
      unit_kerja: {
        select: {
          nama: true,
        },
      },
      profile: {
        select: {
          gelar_depan: true,
          gelar_belakang: true,
        },
      },
    },
  });

  return user;
};

const findUserByNIPM = async (nipm) => {
  const user = await prisma.user.findUnique({
    where: {
      nipm,
    },
  });

  return user;
};

const updateTokenUserByNIPM = async (userData, nipm) => {
  const token = accessToken({
    id: userData.id,
    nipm: userData.nipm,
    role: userData.role,
  });
  const user = await prisma.user.update({
    where: {
      nipm,
    },
    data: {
      token,
    },
    select: {
      role: true,
      token: true,
    },
  });

  return user;
};

const deleteToken = async (id) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      token: null,
    },
  });
  return user;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};

const editUser = async (id, userData) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      email: userData.email,
      img_url: userData.img,
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      status_kepegawaian: true,
      email: true,
      img_url: true,
    },
  });
  return user;
};

const userDashboard = async (nipm) => {
  const user = await prisma.user.findUnique({
    where: {
      nipm,
    },
    select: {
      nama: true,
      nipm: true,
      img_url: true,
      profile: {
        select: {
          gelar_depan: true,
          gelar_belakang: true,
          tempat_lahir: true,
          tanggal_lahir: true,
          alamat: true,
          nomor_telepon: true,
        },
      },
      positions: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      educations: {
        select: {
          jenjang: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      titles: {
        select: {
          jabatan: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });
  return user;
};

const editUserByAdmin = async (id, userData) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      nama: userData.nama,
      nipm: userData.nipm,
      status_kepegawaian: userData.status_kepegawaian,
      unit_kerja_id: userData.unit_kerja_id,
      // password: userData.password,
    },
    select: {
      id: true,
      nama: true,
      nipm: true,
      status_kepegawaian: true,
      unit_kerja: {
        select: {
          nama: true,
        },
      },
    },
  });
  return user;
};

const editPasswordUser = async (id, userData) => {
  const hashPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashPassword,
    },
  });
  return user;
};

export {
  findAllUsers,
  findUserById,
  findUserByEmail,
  findDetailUserById,
  findUserByNIPM,
  findUserCurrent,
  findPasswordUser,
  findChart,
  insertUser,
  updateTokenUserByNIPM,
  deleteToken,
  deleteUser,
  editUser,
  userDashboard,
  editUserByAdmin,
  editPasswordUser,
};
