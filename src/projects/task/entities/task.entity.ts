import { Activity } from "src/projects/activity/entities/activity.entity";
import { Report } from "src/projects/report/entities/report.entity";
import { WorkTrack } from "src/projects/work_track/entities/work_track.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import TaskStatus from "../enum/TaskStatusEnum";

@Entity({ name: 'task' })
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    user_id: number

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: "text" })
    description: string

    @Column({ type: 'timestamp', nullable: true })
    from_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    until_date: Date;

    @Column({ type: "smallint" })
    time_range: number

    @Column({ type: "int" })
    hourly_fee: number

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.SET })
    status: TaskStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Activity, (activity) => activity.tasks)
    activities: Activity

    @OneToMany(() => Report, (report) => report.tasks)
    @JoinColumn()
    reports: Report

    @OneToMany(() => WorkTrack, (workTrack) => workTrack.tasks)
    @JoinColumn()
    workTracks: WorkTrack
}
