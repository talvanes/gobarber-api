import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

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
  public async execute({
    date,
    provider,
  }: IAppointmentRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const appointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );
    if (appointmentInSameDate) {
      throw Error('This appointment is already booked.');
    }

    const appointment = appointmentRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
