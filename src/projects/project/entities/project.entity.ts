import { ProjectMember } from "../../project_member/entities/project_member.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import ProjectStatus from "../enum/ProjectStatusEnum";
import { Activity } from "src/projects/activity/entities/activity.entity";


@Entity({ name: 'project' })
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    code: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "bigint" })
    manager_id: number;

    @Column({ type: "varchar" })
    employer: string;

    @Column()
    from_date: Date;

    @Column()
    until_date: Date;

    @Column({ type: "bigint" })
    cost: number;

    @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.CONFIRM })
    status: ProjectStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ProjectMember, (projectMember) => projectMember.project_id)
    @JoinColumn()
    projectMembers: ProjectMember

    @OneToMany(() => Activity, (activity) => activity.projects)
    @JoinColumn()
    activities: Activity
}
