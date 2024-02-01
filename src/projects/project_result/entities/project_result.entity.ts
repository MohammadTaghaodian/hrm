import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'projectResult' })
export class ProjectResult {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    project_id: number

    @Column({ type: 'varchar' })
    product_name: string

    @Column({ type: 'varchar' })
    product_type: string

    @Column({ type: 'varchar' })
    description: string
 
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
