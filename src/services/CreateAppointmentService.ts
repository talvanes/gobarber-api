import { startOfHour } from 'date-fns';

import Appointment from '../models/appointment';
import AppointmentRepository from '../repositories/appointmentRepository';

interface IAppointmentRequest {
  provider: string;
  date: Date;
}

/*
 * SOLID
 * Single Responsibility
 * Dependency Inversion
 */
class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  public execute({ date, provider }: IAppointmentRequest): Appointment {
    const appointmentDate = startOfHour(date);

    const appointmentInSameDate = this.appointmentRepository.findByDate(
      appointmentDate,
    );
    if (appointmentInSameDate) {
      throw Error('This appointment is already booked.');
    }

    const appointment = this.appointmentRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
