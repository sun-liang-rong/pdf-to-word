import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('rate_limits')
export class RateLimit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ip_address', length: 45, unique: true })
  ipAddress: string;

  @Column({ name: 'request_count', default: 1 })
  requestCount: number;

  @CreateDateColumn({ name: 'window_start' })
  windowStart: Date;
}
