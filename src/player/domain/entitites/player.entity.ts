import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  currentMatchId: string;

  constructor(
    name: string,
    email: string,
    password: string,
    currentMatchId: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.currentMatchId = currentMatchId;
  }

  static create(name: string, email: string, password: string): Player {
    return new Player(name, email, password, null);
  }
}
