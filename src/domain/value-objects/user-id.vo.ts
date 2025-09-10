export interface UserId {
  readonly value: string;
}

export class UserIdVO implements UserId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
