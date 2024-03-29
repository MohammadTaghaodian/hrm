import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import LeavesStatus from "../enum/LeavesStatusEnum"

@Entity({ name: 'leaves' })
export class Leaves {
    // شناسه مرتبط با ترک مرخصی
    @PrimaryGeneratedColumn()
    id: number

    // شناسه کاربری که درخواست ترک مرخصی داده است
    @Column()
    user_id: number

    // شناسه مدیر که درخواست را تأیید یا رد می‌کند
    @Column({ nullable: true })
    manager_id: number

    // تاریخ شروع ترک مرخصی (ممکن است تهی باشد)
    @Column({ nullable: true })
    from_date: Date

    // تاریخ پایان ترک مرخصی
    @Column({ nullable: true })
    until_date: Date

    // تاریخ شروع ترک مرخصی (ممکن است تهی باشد)
    @Column({ nullable: true })
    from_hour: string

    // تاریخ پایان ترک مرخصی
    @Column({ nullable: true })
    until_hour: string

    // نوع ترک مرخصی (مثلاً مرخصی سالیانه، استعلاجی، ...)
    @Column({ nullable: true })
    type: string

    // توضیحات مربوط به درخواست ترک مرخصی
    @Column({ nullable: true })
    description: string

    // وضعیت ترک مرخصی (تأیید شده، در انتظار تأیید، رد شده و غیره)
    @Column({ type: 'enum', enum: LeavesStatus, default: LeavesStatus.SET })
    status: LeavesStatus;

    // توضیحات مدیر در مورد درخواست ترک مرخصی
    @Column({ nullable: true })
    manager_comment: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
