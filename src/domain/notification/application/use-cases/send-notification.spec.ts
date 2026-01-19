import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notifications-repository"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository"
import { SendNotificationUseCase } from "./send-notification"

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: SendNotificationUseCase

describe("send a Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificação",
      content: "Conteúdo da minha notiificação",
    })

    expect(result.isRight()).toBeTruthy()

    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification
    )
  })
})
