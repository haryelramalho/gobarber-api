import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotification from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationRepository {
  // Recuperando os métodos do repositório do typeorm para as notifications
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // inicializando o repositório
    // Passando o nome da conexão por que ela não é a default
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotification): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
