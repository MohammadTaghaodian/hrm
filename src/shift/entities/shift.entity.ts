import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShiftDay } from "./shift_day.entity";

@Entity({ name: 'shift' })
export class Shift {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @OneToMany(() => ShiftDay, (shiftDay) => shiftDay.shifts)
    @JoinColumn()
    shiftDays: number

      // تاریخ ایجاد ماموریت
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
