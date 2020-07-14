import { isEqual } from 'date-fns';
import Appointment from '../models/appointment';

/* DTO - Data Transfer Object */
interface IAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public all(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const appointmentFound = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    return appointmentFound || null;
  }

  public create({ provider, date }: IAppointmentDTO): Appointment {
    const appointment = new Appointment({
      provider,
      date,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
