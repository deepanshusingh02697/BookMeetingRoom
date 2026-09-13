import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomEquipment } from "./room-equipment.entity.js";

@Entity("Equipment")
export class Equipment{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",unique:true})
    name:string

    @OneToMany(()=>RoomEquipment,(roomEquipment)=>roomEquipment.equipment)
    roomEquipments:RoomEquipment[]
}