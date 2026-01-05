import { expect, describe, beforeEach, it } from "vitest"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { EditAnswerUseCase } from "./edit-answer"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { NotAllowedError } from "./errors/not-allowed-error"
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository"
import { makeAnswerAttachment } from "../../../../../test/factories/make-answer-attachment"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe("edit an Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    )
  })
  it("should save an Answer correctly", async () => {
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

    await sut.execute({
      id: "1",
      authorId: "1",
      content: "Nova resposta",
      attachmentsIds: ["1", "3"],
    })

    expect(inMemoryAnswersRepository.items[0]?.content).toEqual("Nova resposta")
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ])
  })
  it("should not be able to edit an Answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      id: "1",
      authorId: "user-x",
      content: "Nova resposta",
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
