import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointments: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointments = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Pretend that it is now
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    const appointment = await createAppointments.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider',
      user_id: '471623946',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
    expect(appointment.user_id).toBe('471623946');
  });

  it('should not be able to create two appointments to the same hour', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await fakeAppointmentsRepository.create({
      date: appointmentDate,
      provider_id: 'provider',
      user_id: '471623946',
    });

    await expect(
      createAppointments.execute({
        date: appointmentDate,
        provider_id: 'provider',
        user_id: '471623946',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past date', async () => {
    // Pretend that it is some time in the past
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointments.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider',
        user_id: '52943686',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with same user as provider', async () => {
    // Pretend that it is some time in the past
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointments.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '52943686',
        user_id: '52943686',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before 8.a.m', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    // should not schedule before 8 a.m.
    await expect(
      createAppointments.execute({
        date: new Date(2020, 4, 10, 7),
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment after 5 p.m.', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    // and should not schedule after 5 p.m. either
    await expect(
      createAppointments.execute({
        date: new Date(2020, 4, 10, 18),
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
