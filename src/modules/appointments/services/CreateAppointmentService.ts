import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/appointment';
import AppointmentRepository from '../repositories/appointmentRepository';

interface IAppointmentRequest {
  provider_id: string;
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
    provider_id,
  }: IAppointmentRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const appointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );
    if (appointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
