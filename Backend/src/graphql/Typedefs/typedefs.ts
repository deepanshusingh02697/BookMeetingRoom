export const typeDefs = `#graphql

scalar JSON

enum Role {
  EMPLOYEE
  ADMIN
}

enum RoomStatus {
  AVAILABLE
  DISABLED
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}
enum RecurringFreq{
  DAILY
  WEEKLY
}

type User {
  id: ID!
  firstname: String!
  lastname: String!
  email: String!
  role: Role!
  createdAt: String!
  updatedAt: String!
}

type Room {
  id: ID!
  name: String!
  capacity: Int!
  floor: Int!
  location: String!
  status: RoomStatus!
  particiCount:Int!
  availableSpace:Int!
  equipments: [Equipment!]!
}

type Equipment {
  id: ID!
  name: String!
  rooms: [Room!]!
}

type Booking {
  id: ID!
  roomId: ID!
  organizerId: ID!
  room: Room!
  organizer: User!
  title: String!
  description: String
  startTime: String!
  endTime: String!
  status: BookingStatus!
  recurrenceId: String
  participants: [Participant!]!
  checkIn: CheckIn
  createdAt: String!
}

type Participant {
  id: ID!
  bookingId: ID!
  userId: ID!
  booking: Booking!
  user: User!
}

type CheckIn {
  id: ID!
  bookingId: ID!
  checkInBy: ID!
  booking: Booking!
  user: User!
  checkedInAt: String!
}

type WaitlistEntry {
  id: ID!
  roomId: ID!
  userId: ID!
  room: Room!
  user: User!
  startTime: String!
  endTime: String!
  createdAt: String!
}

type Maintenance {
  id: ID!
  roomId: ID!
  room: Room!
  startTime: String!
  endTime: String!
  reason: String
}

type RoomUsedStats{
  room:Room!
  totalBookings: Int!
  cancelledCount: Int!
  noShowCount: Int!
  completedCount: Int!
}
type UsageData{
  totalBookings:Int!
  totalCancelled: Int!
  totalNoShow: Int!
  utilizeByRoom: [RoomUsedStats!]!
}


type AuthPayload {
  success: Boolean!
  msg: String!
  user: User
}

type RoomPayload {
  success:Boolean!
  msg:String!
  room:Room
}
type EquipmentPayload{
  success:Boolean!
  msg:String!
  equipment:Equipment
}
type BookingPayload {
  success: Boolean!
  msg: String!
  booking: Booking
}
type CheckInPayload{
  success: Boolean!
  msg: String!
  checkIn: CheckIn
}
type WaitListPayload{
  success:Boolean!
  msg:String!
  waitlist: WaitlistEntry
}
type MaintinancePayload{
  success:Boolean!
  msg:String!
  maintinance:Maintenance
}


type Query {
  CurrUser:User!
  Users:[User!]!
  SearchRooms(
    startTime: String!
    endTime: String!
    capacity: Int
    floor: Int
    status: RoomStatus
  ): [Room!]!

  MyBookings: [Booking!]!
  MyMeetings: [Booking!]!
  
  BookingDetails(id: Int!): Booking

  MyWaitlist:[WaitlistEntry!]!

  RecurringBookingGroup(recurrenceId: String!): [Booking!]!

  RoomMaintinance(roomId:Int!):[Maintenance!]!

  AdminCalender(startDate: String!,endDate:String!):[Booking!]!
  UsedAnalytics(startDate:String!,endDate:String!):UsageData!

  GetRooms:[Room!]!
  GetRoomDetails(roomId:Int!):Room!
  GetEquipments:[Equipment!]!
}
type Mutation {
  SignUp(
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  ): AuthPayload!

  LogIn(
    email: String!
    password: String!
  ): AuthPayload!

  AdminLogIn(
    email: String!
    password: String!
  ): AuthPayload!

  LogOut:AuthPayload!

  CreateRoom(
    name: String!
    capacity: Int!
    floor: Int!
    location: String!
  ): RoomPayload!

  UpdateRoom(
    id: Int!
    name: String
    capacity: Int
    floor: Int
    location: String
  ): RoomPayload!

  DisableRoom(
    id: Int!
  ): RoomPayload!
  EnableRoom(id:Int!):RoomPayload!

  CreateEquipment(
    name: String!
  ): EquipmentPayload!

  AddEquipmentToRoom(
    roomId: Int!
    equipmentId: Int!
  ): RoomPayload!

  RemoveEquipmentFromRoom(
    roomId: Int!
    equipmentId: Int!
  ): RoomPayload!
  EditEquipment(
    equipmentId:Int!
    name:String
  ):EquipmentPayload!

  CreateBooking(
    roomId: Int!
    title: String!
    description: String
    startTime: String!
    endTime: String!
    participantUserIds: [Int!]
    recurringFreq:RecurringFreq
    recurrenceEndDate:String
  ): BookingPayload!
  CancelBooking(
    id: Int!
  ): BookingPayload!
  CancelRecurringBooking(recurId:String!):String!

  AddParticipant(bookingId:Int!,userId:Int!):BookingPayload!
  RemoveParticipant(bookingId: Int!,userId: Int!): BookingPayload!

  JoinWaitlist(roomId: Int!,startTime: String!,endTime: String!): WaitListPayload!
  LeaveWaitlist(id: Int!): String!

  CheckInToBooking(bookingId:Int!):CheckInPayload!

  CreateMaint(roomId:Int! startTime:String! endTime:String!, reason:String):MaintinancePayload!
  DeleteMain(id:Int!):String!
}
`;
