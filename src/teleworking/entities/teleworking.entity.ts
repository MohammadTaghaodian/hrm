import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import TeleworkingStatus from "../enum/TeleworkingStatusEnum";

@Entity({ name: 'teleworkings' })
export class Teleworking {
    @PrimaryGeneratedColumn()
    id: number; // شناسه سابقه دورکاری

    @Column()
    user_id: number; // شناسه کاربر

    @Column({ nullable: true })
    from_date: Date; // تاریخ شروع دورکاری 

    @Column({ nullable: true })
    until_date: Date; // تاریخ پایان دورکاری 

    @Column({ nullable: true })
    description: string; // توضیحات دورکاری

    @Column({ nullable: true })
    manager_id: number; // شناسه مدیر

    @Column({ nullable: true })
    manager_from_date: Date; // تاریخ شروع دورکاری تایید شده توسط مدیر (اختیاری)

    @Column({ nullable: true })
    manager_until_date: Date; // تاریخ پایان دورکاری تایید شده توسط مدیر (اختیاری)

    @Column({ nullable: true })
    manager_description: string; // توضیحات دورکاری مدیر

    @Column({ nullable: true })
    project: number; // شناسه پروژه

    @Column({ type: 'enum', enum: TeleworkingStatus, default: TeleworkingStatus.SET })
    status: TeleworkingStatus; // وضعیت دورکاری

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}