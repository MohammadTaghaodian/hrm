import { Task } from "src/projects/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'report' })
export class Report {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    comment: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Task, (task) => task.reports)
    tasks: Task
}
