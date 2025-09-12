export interface UserProps {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: boolean;
  image?: string;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>): User {
    const now = new Date();
    return new User({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified ?? false;
  }

  get image(): string | undefined {
    return this.props.image;
  }

  updateProfile(name: string, image?: string): User {
    return new User({
      ...this.props,
      name,
      image,
      updatedAt: new Date(),
    });
  }

  verifyEmail(): User {
    return new User({
      ...this.props,
      emailVerified: true,
      updatedAt: new Date(),
    });
  }

  toPrimitives() {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      emailVerified: this.props.emailVerified,
      image: this.props.image,
    };
  }
}
