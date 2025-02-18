import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    note: string;

    @Column()
    dateAdded: Date;

    @ManyToOne(() => User, user => user.notes)
    user: User;
}