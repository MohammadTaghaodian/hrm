import { Task } from "src/projects/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'work_track' })
export class WorkTrack {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    attendance_id: number

    @Column({ type: 'bigint', nullable: true })
    time: number

    @Column({ nullable: true })
    from_date: number;

    @Column({ nullable: true })
    until_date: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Task, (task) => task.workTracks)
    tasks: Task
}
