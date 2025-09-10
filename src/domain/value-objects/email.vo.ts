export interface Email {
  readonly value: string;
}

export class EmailVO implements Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (!EmailVO.EMAIL_REGEX.test(value)) {
      throw new Error('Invalid email format');
    }
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
