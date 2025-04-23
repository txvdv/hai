import {
  failure,
  Message,
  MessageHandler,
  Result,
  success,
} from '../Messaging/messaging.interface.js';
import { UnitOfWork } from '../../shared/unit-of-work.js';
import { UserRepository } from '../../domain/User/UserRepository.js';
import { User } from '../../domain/User/User.js';
import { UserAlreadyExistsError } from '../../domain/User/UserAlreadyExistsError.js';

export class CreateUser implements Message {
  type = 'CreateUser';
}

export type CreateUserResult = Result<
  {
    id: string;
  },
  UserAlreadyExistsError
>;

export class CreateUserHandler
  implements MessageHandler<CreateUser, CreateUserResult>
{
  private readonly userRepository: UserRepository;
  private uow: UnitOfWork;

  constructor(deps: { userRepository: UserRepository; uow: UnitOfWork }) {
    this.userRepository = deps.userRepository;
    this.uow = deps.uow;
  }

  async handle(_: CreateUser): Promise<CreateUserResult> {
    const userExists = await this.userRepository.hasUser();

    if (userExists) {
      return failure(new UserAlreadyExistsError());
    }

    const user = User.withDefaultPreferences();

    this.uow.start();
    this.userRepository.save(user);
    await this.uow.commit();

    return success({
      id: user.getIdentifier().toString(),
    });
  }
}
