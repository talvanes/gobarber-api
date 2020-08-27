import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/appointment';
import AppointmentRepository from '../repositories/appointmentRepository';

interface IAppointmentRequest {
  provider_id: string;
  date: Date;
}

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

    const appointment = await appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
