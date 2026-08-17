export interface CurrUser_Interface {
  CurrUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: "EMPLOYEE" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  } | null;
}
export interface Users_Interface {
  Users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: "EMPLOYEE" | "ADMIN";
  }[];
}

export interface SignUp_Interface {
  SignUp: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface Get_Login_Interface {
  LogIn: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface Admin_Login_Interface {
  AdminLogIn: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface LogOut_Interface {
  LogOut: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

export interface GetRooms_Interface {
  GetRooms: [
    {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: string;
      equipments: {
        id: string;
        name: string;
      }[];
    },
  ];
}
export interface GetRoomDeatils_Interface {
  GetRoomDetails: {
    id: string;
    name: string;
    capacity: number;
    floor: number;
    location: string;
    status: string;
    particiCount: number;
    availableSpace: number;
    equipments: {
      id: string;
      name: string;
    }[];
  } | null;
}
export interface CreateRoom_Interface {
  CreateRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    } | null;
  };
}

export interface UpdateRoom_Interface {
  UpdateRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    } | null;
  };
}
export interface DisableRoom_Interface {
  DisableRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    } | null;
  };
}
export interface EnableRoom_Interface {
  EnableRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    } | null;
  };
}

export interface GetEquipment_Interface {
  GetEquipments: {
    id: string;
    name: string;
  }[];
}
export interface CreateEquipment_Interface {
  CreateEquipment: {
    success: boolean;
    msg: string;
    equipment: {
      id: string;
      name: string;
    } | null;
  };
}
export interface AddEquToRoom_Interface {
  AddEquipmentToRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
      equipments: {
        id: string;
        name: string;
      }[];
    } | null;
  };
}
export interface RemoveEquromRoom_Interface {
  RemoveEquipmentFromRoom: {
    success: boolean;
    msg: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
      equipments: {
        id: string;
        name: string;
      }[];
    } | null;
  };
}
export interface udpateEquipment_Interface {
  EditEquipment: {
    equipment: {
      id: string;
    };
    msg: string;
    success: boolean;
  };
}

export interface CreateBooking_Interface {
  CreateBooking: {
    success: boolean;
    msg: string;
    booking: {
      id: string;
      roomId: string;
      organizerId: string;
      title: string;
      description: string | null;
      startTime: string;
      endTime: string;
      status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
      isRecurring: boolean;
      recurrenceRule: {
        frequency: "DAILY" | "WEEKLY";
        endDate: string | null;
      } | null;
      recurrenceId: string | null;
      createdAt: string;
      room: {
        id: string;
        name: string;
        capacity: number;
        floor: number;
        location: string;
        status: "AVAILABLE" | "DISABLED";
      };
      organizer: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
      participants: {
        id: string;
        bookingId: string;
        userId: string;
        user: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          role: "EMPLOYEE" | "ADMIN";
        };
      }[];
      checkIn: {
        id: string;
        bookingId: string;
        checkInBy: string;
        checkedInAt: string;
      } | null;
    } | null;
  };
}
export interface CancelBooking_Interface {
  CancelBooking: {
    success: boolean;
    msg: string;
    booking: {
      id: string;
      title: string;
      status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
      startTime: string;
      endTime: string;
      room: {
        id: string;
        name: string;
      };
    } | null;
  };
}

export interface AddParticipant_Interface {
  AddParticipant: {
    success: boolean;
    msg: string;
    booking: {
      id: string;
      title: string;
      status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
      participants: {
        id: string;
        userId: string;
        user: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
        };
      }[];
    } | null;
  };
}
export interface RemoveParticipant_Interface {
  RemoveParticipant: {
    success: boolean;
    msg: string;
    booking: {
      id: string;
      title: string;
      status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
      participants: {
        id: string;
        userId: string;
        user: {
          id: string;
          firstname: string;
          lastname: string;
          email: string;
        };
      }[];
    } | null;
  };
}

export interface JoinWaitlist_Interface {
  JoinWaitlist: {
    success: boolean;
    msg: string;
    waitlist: {
      id: string;
      roomId: string;
      userId: string;
      startTime: string;
      endTime: string;
      createdAt: string;
      room: {
        id: string;
        name: string;
        capacity: number;
        floor: number;
        location: string;
        status: "AVAILABLE" | "DISABLED";
      };
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
      };
    } | null;
  };
}
export interface LeaveWaitlist_Interface {
  LeaveWaitlist: string;
}
export interface CheckInToBooking_Interface {
  CheckInToBooking: {
    success: boolean;
    msg: string;
    checkIn: {
      id: string;
      bookingId: string;
      checkInBy: string;
      checkedInAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
      };
    } | null;
  };
}
export interface ReleaseBooking_Interface {
  ReleaseBooking: string;
}

export interface RoomMaintinance_Interface {
  RoomMaintinance: {
    id: string;
    roomId: string;
    startTime: string;
    endTime: string;
    reason: string | null;
  }[];
}
export interface CreateMaint_Interface {
  CreateMaint: {
    success: boolean;
    msg: string;
    maintinance: {
      id: string;
      roomId: string;
      startTime: string;
      endTime: string;
      reason: string | null;
      room: {
        id: string;
        name: string;
        capacity: number;
        floor: number;
        location: string;
        status: "AVAILABLE" | "DISABLED";
      };
    } | null;
  };
}
export interface DeleteMain_Interface {
  DeleteMain: string;
}

export interface SearchRooms_Interface {
  SearchRooms: {
    id: string;
    name: string;
    capacity: number;
    floor: number;
    location: string;
    status: "AVAILABLE" | "DISABLED";
    equipments: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface MyBookings_Interface {
  MyBookings: {
    id: string;
    roomId: string;
    organizerId: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    isRecurring: boolean;
    recurrenceRule: {
      frequency: "DAILY" | "WEEKLY";
      endDate: string | null;
    } | null;
    recurrenceId: string | null;
    createdAt: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
      equipments: {
        id: string;
        name: string;
      }[];
    };
    organizer: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
    };
    participants: {
      id: string;
      bookingId: string;
      userId: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    }[];
    checkIn: {
      id: string;
      bookingId: string;
      checkInBy: string;
      checkedInAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    } | null;
  }[];
}

export interface BookingDetails_Interface {
  BookingDetails: {
    id: string;
    roomId: string;
    organizerId: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    isRecurring: boolean;
    recurrenceRule: {
      frequency: "DAILY" | "WEEKLY";
      endDate: string | null;
    } | null;
    recurrenceId: string | null;
    createdAt: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
      equipments: {
        id: string;
        name: string;
      }[];
    };
    organizer: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
    };
    participants: {
      id: string;
      bookingId: string;
      userId: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    }[];
    checkIn: {
      id: string;
      bookingId: string;
      checkInBy: string;
      checkedInAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    } | null;
  } | null;
}

export interface MyMeetings_Interface {
  MyMeetings: {
    id: string;
    roomId: string;
    organizerId: string;

    title: string;
    description: string | null;

    startTime: string;
    endTime: string;

    status:
      | "CONFIRMED"
      | "CANCELLED"
      | "COMPLETED"
      | "NO_SHOW";

    isRecurring: boolean;

    recurrenceRule: {
      frequency: "DAILY" | "WEEKLY";
      endDate: string | null;
    } | null;

    recurrenceId: string | null;

    createdAt: string;

    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;

      status: "AVAILABLE" | "DISABLED";

      equipments: {
        id: string;
        name: string;
      }[];
    };

    organizer: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
      createdAt: string;
      updatedAt: string;
    };

    participants: {
      id: string;
      bookingId: string;
      userId: string;

      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
        createdAt: string;
        updatedAt: string;
      };
    }[];

    checkIn: {
      id: string;
      bookingId: string;
      checkInBy: string;
      checkedInAt: string;

      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  }[];
}

export interface MyWaitlist_Interface {
  MyWaitlist: {
    id: string;
    roomId: string;
    userId: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    };
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
    };
  }[];
}

export interface RecurringBookingGroup_Interface {
  RecurringBookingGroup: {
    id: string;
    roomId: string;
    organizerId: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    isRecurring: boolean;
    recurrenceRule: {
      frequency: "DAILY" | "WEEKLY";
      endDate: string | null;
    } | null;
    recurrenceId: string | null;
    createdAt: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    };
    organizer: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
    };
    participants: {
      id: string;
      userId: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
      };
    }[];
    checkIn: {
      id: string;
      checkInBy: string;
      checkedInAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
      };
    } | null;
  }[];
}

export interface AdminCalender_Interface {
  AdminCalender: {
    id: string;
    roomId: string;
    organizerId: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    isRecurring: boolean;
    recurrenceRule: {
      frequency: "DAILY" | "WEEKLY";
      endDate: string | null;
    } | null;
    recurrenceId: string | null;
    createdAt: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      location: string;
      status: "AVAILABLE" | "DISABLED";
    };
    organizer: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "EMPLOYEE" | "ADMIN";
    };
    participants: {
      id: string;
      userId: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    }[];
    checkIn: {
      id: string;
      checkInBy: string;
      checkedInAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "EMPLOYEE" | "ADMIN";
      };
    } | null;
  }[];
}
export interface UsedAnalytics_Interface {
  UsedAnalytics: {
    totalBookings: number;
    totalCancelled: number;
    totalNoShow: number;
    utilizeByRoom: {
      totalBookings: number;
      cancelledCount: number;
      noShowCount: number;
      completedCount: number;
      room: {
        id: string;
        name: string;
        capacity: number;
        floor: number;
        location: string;
        status: "AVAILABLE" | "DISABLED";
      };
    }[];
  };
}
