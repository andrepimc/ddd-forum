import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notifications-repository"
import { ReadNotificationUseCase } from "./read-notification"
import { makeNotification } from "../../../../../test/factories/make-notification"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { a } from "vitest/dist/chunks/suite.d.BJWk38HB"

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe("read a Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it("should be able to read a notification", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId("user-1"),
    })
    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationsRepository.items[0]?.readAt).toEqual(
      expect.any(Date)
    )
  })
})
