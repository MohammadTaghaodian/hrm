import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import UserType from "../enum/UserTypeEnum";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    device_id: string
    
    @Column({ type: 'enum', enum: UserType, default: UserType.EMPLOYEES })
    type: UserType;

    @Column({ nullable: true })
    personnel_code: string

    @Column({ nullable: true })
    mobile: string

    @Column({ nullable: true })
    telephone_number: string

    // @Column()
    // password: string

    @Column({ nullable: true })
    first_name: string

    @Column({ nullable: true })
    last_name: string

    @Column({ nullable: true })
    father_name: string

    @Column({ nullable: true })
    province: string

    @Column({ nullable: true })
    city: string

    @Column({ nullable: true })
    mellii_code: string

    @Column({ nullable: true })
    sh_code: string

    @Column({ nullable: true })
    birthday_date: string

    @Column({ nullable: true })
    birthday_year: number

    @Column({ nullable: true })
    birthday_month: number

    @Column({ nullable: true })
    birthday_day: number

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    resume: string

    @Column({ nullable: true })
    fields: string

    @Column({ nullable: true })
    grade: string

    @Column({ nullable: true })
    married: boolean

    @Column({ nullable: true })
    assist_type: number

    @Column({ nullable: true })
    membership_type: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
