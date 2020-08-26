import Appointment from '../infra/typeorm/entities/appointment';

export default interface IAppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
}
