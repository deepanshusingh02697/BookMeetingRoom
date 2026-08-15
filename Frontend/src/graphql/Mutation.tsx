import { gql } from "@apollo/client";

export const signUpUser_Mutation = gql`
  mutation SignUp(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    SignUp(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
    ) {
      success
      msg
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

export const loginUser_Mutation = gql`
  mutation LogIn(
    $email: String!
    $password: String!
  ) {
    LogIn(
      email: $email
      password: $password
    ) {
      success
      msg
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

export const adminLogin_Mutation = gql`
  mutation AdminLogIn(
    $email: String!
    $password: String!
  ) {
    AdminLogIn(
      email: $email
      password: $password
    ) {
      success
      msg
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

export const logout_Mutation = gql`
  mutation LogOut {
    LogOut {
      success
      msg
    }
  }
`;

export const createRoom_Mutation = gql`
  mutation CreateRoom(
    $name: String!
    $capacity: Int!
    $floor: Int!
    $location: String!
  ) {
    CreateRoom(
      name: $name
      capacity: $capacity
      floor: $floor
      location: $location
    ) {
      success
      msg
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
`;

export const updateRoom_Mutation = gql`
  mutation UpdateRoom(
    $id: Int!
    $name: String
    $capacity: Int
    $floor: Int
    $location: String
  ) {
    UpdateRoom(
      id: $id
      name: $name
      capacity: $capacity
      floor: $floor
      location: $location
    ) {
      success
      msg
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
`;

export const disableRoom_Mutation = gql`
  mutation DisableRoom($id: Int!) {
    DisableRoom(id: $id) {
      success
      msg
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
`;

export const enableRoom_Mutation = gql`
  mutation EnableRoom($id: Int!) {
    EnableRoom(id: $id) {
      success
      msg
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
`;

export const createEquipment_Mutation = gql`
  mutation CreateEquipment($name: String!) {
    CreateEquipment(name: $name) {
      success
      msg
      equipment {
        id
        name
      }
    }
  }
`;

export const addEquipmentToRoom_Mutation = gql`
  mutation AddEquipmentToRoom(
    $roomId: Int!
    $equipmentId: Int!
  ) {
    AddEquipmentToRoom(
      roomId: $roomId
      equipmentId: $equipmentId
    ) {
      success
      msg
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
`;

export const removeEquipmentFromRoom_Mutation = gql`
  mutation RemoveEquipmentFromRoom(
    $roomId: Int!
    $equipmentId: Int!
  ) {
    RemoveEquipmentFromRoom(
      roomId: $roomId
      equipmentId: $equipmentId
    ) {
      success
      msg
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
`;

export const createBooking_Mutation = gql`
  mutation CreateBooking(
    $roomId: Int!
    $title: String!
    $description: String
    $startTime: String!
    $endTime: String!
    $participantUserIds: [Int!]
    $recurringFreq: RecurringFreq
    $recurrenceEndDate: String
  ) {
    CreateBooking(
      roomId: $roomId
      title: $title
      description: $description
      startTime: $startTime
      endTime: $endTime
      participantUserIds: $participantUserIds
      recurringFreq: $recurringFreq
      recurrenceEndDate: $recurrenceEndDate
    ) {
      success
      msg
      booking {
        id
        roomId
        organizerId
        title
        description
        startTime
        endTime
        status
        isRecurring
        recurrenceRule
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
  }
`;

export const cancelBooking_Mutation = gql`
  mutation CancelBooking($id: Int!) {
    CancelBooking(id: $id) {
      success
      msg
      booking {
        id
        roomId
        organizerId
        title
        description
        startTime
        endTime
        status
        isRecurring
        recurrenceRule
        recurrenceId
        createdAt
        room {
          id
          name
          capacity
          floor
          location
          status
        }
        organizer {
          id
          firstname
          lastname
          email
          role
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
          }
        }
      }
    }
  }
`;

export const cancelRecurringBooking_Mutation = gql`
  mutation CancelRecurringBooking($recurId: String!) {
    CancelRecurringBooking(recurId: $recurId)
  }
`;

export const addParticipant_Mutation = gql`
  mutation AddParticipant(
    $bookingId: Int!
    $userId: Int!
  ) {
    AddParticipant(
      bookingId: $bookingId
      userId: $userId
    ) {
      success
      msg
      booking {
        id
        roomId
        organizerId
        title
        description
        startTime
        endTime
        status
        isRecurring
        recurrenceRule
        recurrenceId
        createdAt
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
          }
        }
      }
    }
  }
`;

export const removeParticipant_Mutation = gql`
  mutation RemoveParticipant(
    $bookingId: Int!
    $userId: Int!
  ) {
    RemoveParticipant(
      bookingId: $bookingId
      userId: $userId
    ) {
      success
      msg
      booking {
        id
        roomId
        organizerId
        title
        description
        startTime
        endTime
        status
        isRecurring
        recurrenceRule
        recurrenceId
        createdAt
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
          }
        }
      }
    }
  }
`;

export const joinWaitlist_Mutation = gql`
  mutation JoinWaitlist(
    $roomId: Int!
    $startTime: String!
    $endTime: String!
  ) {
    JoinWaitlist(
      roomId: $roomId
      startTime: $startTime
      endTime: $endTime
    ) {
      success
      msg
      waitlist {
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
        }
        user {
          id
          firstname
          lastname
          email
          role
        }
      }
    }
  }
`;

export const leaveWaitlist_Mutation = gql`
  mutation LeaveWaitlist($id: Int!) {
    LeaveWaitlist(id: $id)
  }
`;

export const checkInToBooking_Mutation = gql`
  mutation CheckInToBooking($bookingId: Int!) {
    CheckInToBooking(bookingId: $bookingId) {
      success
      msg
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
        booking {
          id
          roomId
          organizerId
          title
          startTime
          endTime
          status
        }
      }
    }
  }
`;

export const releaseBooking_Mutation = gql`
  mutation ReleaseBooking {
    ReleaseBooking
  }
`;

export const createMaintenance_Mutation = gql`
  mutation CreateMaint(
    $roomId: Int!
    $startTime: String!
    $endTime: String!
    $reason: String
  ) {
    CreateMaint(
      roomId: $roomId
      startTime: $startTime
      endTime: $endTime
      reason: $reason
    ) {
      success
      msg
      maintinance {
        id
        roomId
        startTime
        endTime
        reason
      }
    }
  }
`;

export const deleteMaintenance_Mutation = gql`
  mutation DeleteMain($id: Int!) {
    DeleteMain(id: $id)
  }
`;
