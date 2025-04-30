import { MessageDispatcher } from '../Messaging/messaging.interface.js';
import { CreateUserHandler } from './CreateUser.js';
import { UnitOfWork } from '../../shared/unit-of-work.js';
import { UserRepository } from '../../domain/User/UserRepository.js';

export function registerUserHandlers(deps: {
  messageDispatcher: MessageDispatcher;
  userRepository: UserRepository;
  uow: UnitOfWork;
}) {
  const { messageDispatcher, userRepository, uow } = deps;

  const userHandler = new CreateUserHandler({
    userRepository,
    uow,
  });

  messageDispatcher.register('CreateUser', userHandler);
}
