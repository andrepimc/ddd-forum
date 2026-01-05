import { expect, describe, beforeEach, it } from "vitest"

import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { DeleteAnswerUseCase } from "./delete-answer"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { NotAllowedError } from "./errors/not-allowed-error"
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository"
import { makeAnswerAttachment } from "../../../../../test/factories/make-answer-attachment"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe("delete a Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  it("should delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      })
    )

    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)

    await sut.execute({ id: "1", authorId: "1" })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })
  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)
    const result = await sut.execute({ id: "1", authorId: "2" })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
