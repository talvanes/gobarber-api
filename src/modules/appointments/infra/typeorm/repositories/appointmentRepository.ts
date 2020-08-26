import { EntityRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../entities/appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment>
  implements IAppointmentsRepository {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFound = await this.findOne({
      where: { date },
    });

    return appointmentFound;
  }
}

export default AppointmentRepository;
