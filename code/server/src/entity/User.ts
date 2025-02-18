import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Note } from "./Note";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    phoneNumber: string;

    @OneToMany(() => Note, note => note.user)
    notes: Note[];
}
