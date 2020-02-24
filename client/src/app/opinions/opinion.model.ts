import { User } from '../auth/user.model';

export class Opinion {
  constructor(
    public _id: string,
    public text: string,
    public updatedAt: Date,
    public createdBy: User
  ) {}
}
