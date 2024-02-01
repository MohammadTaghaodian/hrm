import { Project } from "../../project/entities/project.entity"; 
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'project_member' })
export class ProjectMember {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=>Project , (Project) =>Project.projectMembers)
    project_id: number

    @Column()
    user_id: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
