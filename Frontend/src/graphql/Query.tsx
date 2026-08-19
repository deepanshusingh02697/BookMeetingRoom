import { gql } from "@apollo/client";

export const currentUser_Query = gql`
  query CurrUser {
    CurrUser {
      id
      firstname
      lastname
      email
      role
      createdAt
      updatedAt
    }
  }
`;
export const users_Query = gql`
  query Users {
    Users {
      id
      firstname
      lastname
      email
      role
    }
  }
`;
export const GetRooms_Query = gql`
  query GetRooms {
    GetRooms {
      id
      name
      capacity
      floor
      location
      status
      equipments {
        id
        name
      }
    }
  }
`;
export const GetRoomDetails_Query = gql`
  query GetRoomDetails($roomId: Int!) {
    GetRoomDetails(roomId: $roomId) {
      id
      name
      capacity
      floor
      location
      status
      particiCount
      availableSpace
      equipments {
        id
        name
      }
    }
  }
`;
export const GetEquipment_Query = gql`
  query GetEquipments {
    GetEquipments {
      id
      name
    }
  }
`;
export const searchRooms_Query = gql`
  query SearchRooms(
    $startTime: String!
    $endTime: String!
    $capacity: Int
    $floor: Int
    $status: RoomStatus
  ) {
    SearchRooms(
      startTime: $startTime
      endTime: $endTime
      capacity: $capacity
      floor: $floor
      status: $status
    ) {
      id
      name
      capacity
      floor
      location
      status
      equipments {
        id
        name
      }
    }
  }
`;

export const myBookings_Query = gql`
  query MyBookings {
    MyBookings {
      id
      roomId
      organizerId
      title
      description
      startTime
      endTime
      status
      recurrenceId
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      organizer {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }

      participants {
        id
        bookingId
        userId
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }

      checkIn {
        id
        bookingId
        checkInBy
        checkedInAt
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const bookingDetails_Query = gql`
  query BookingDetails($id: Int!) {
    BookingDetails(id: $id) {
      id
      roomId
      organizerId
      title
      description
      startTime
      endTime
      status
      recurrenceId
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      organizer {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }

      participants {
        id
        bookingId
        userId
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }

      checkIn {
        id
        bookingId
        checkInBy
        checkedInAt
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const recurringBookingGroup_Query = gql`
  query RecurringBookingGroup($recurrenceId: String!) {
    RecurringBookingGroup(recurrenceId: $recurrenceId) {
      id
      roomId
      organizerId
      title
      description
      startTime
      endTime
      status
      recurrenceId
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      organizer {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }

      participants {
        id
        bookingId
        userId
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }

      checkIn {
        id
        bookingId
        checkInBy
        checkedInAt
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const MyMeetings_Query = gql`
  query MyMeetings {
    MyMeetings {
      id
      roomId
      organizerId
      title
      description
      startTime
      endTime
      status
      recurrenceId
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      organizer {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }

      participants {
        id
        bookingId
        userId

        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }

      checkIn {
        id
        bookingId
        checkInBy
        checkedInAt

        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const myWaitlist_Query = gql`
  query MyWaitlist {
    MyWaitlist {
      id
      roomId
      userId
      startTime
      endTime
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      user {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }
    }
  }
`;

export const roomMaintenance_Query = gql`
  query RoomMaintinance($roomId: Int!) {
    RoomMaintinance(roomId: $roomId) {
      id
      roomId
      startTime
      endTime
      reason
    }
  }
`;

export const adminCalendar_Query = gql`
  query AdminCalender($startDate: String!, $endDate: String!) {
    AdminCalender(startDate: $startDate, endDate: $endDate) {
      id
      roomId
      organizerId
      title
      description
      startTime
      endTime
      status
      recurrenceId
      createdAt

      room {
        id
        name
        capacity
        floor
        location
        status
        equipments {
          id
          name
        }
      }

      organizer {
        id
        firstname
        lastname
        email
        role
        createdAt
        updatedAt
      }

      participants {
        id
        bookingId
        userId
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }

      checkIn {
        id
        bookingId
        checkInBy
        checkedInAt
        user {
          id
          firstname
          lastname
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const usedAnalytics_Query = gql`
  query UsedAnalytics($startDate: String!, $endDate: String!) {
    UsedAnalytics(startDate: $startDate, endDate: $endDate) {
      totalBookings
      totalCancelled
      totalNoShow

      utilizeByRoom {
        totalBookings
        cancelledCount
        noShowCount
        completedCount

        room {
          id
          name
          capacity
          floor
          location
          status
          equipments {
            id
            name
          }
        }
      }
    }
  }
`;
