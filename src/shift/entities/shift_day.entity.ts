import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Shift } from "./shift.entity";
import ShiftDayType from "../enum/shiftDayEnum";

@Entity({ name: 'shift_day' })
export class ShiftDay {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: ShiftDayType, default: ShiftDayType.Saturday })
    weekDay: ShiftDayType

    @Column()
    from: number

    @Column()
    to: number

    @ManyToOne(() => Shift, (shift) => shift.shiftDays)
    shifts: number

      // تاریخ ایجاد ماموریت
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // تاریخ به‌روزرسانی ماموریت
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
