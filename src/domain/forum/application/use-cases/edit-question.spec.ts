import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { EditQuestionUseCase } from "./edit-question"
import { NotAllowedError } from "./errors/not-allowed-error"
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository"
import { makeQuestionAttachment } from "../../../../../test/factories/make-question-attachment"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe("edit a Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    )
  })
  it("should be able to edit a question correctly", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      })
    )

    await sut.execute({
      id: "1",
      authorId: "1",
      title: "Novo título",
      content: "Novo conteúdo",
      attachmentsIds: ["1", "3"],
    })

    expect(inMemoryQuestionsRepository.items[0]?.title).toEqual("Novo título")
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ])
  })
  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      id: "1",
      authorId: "user-x",
      title: "Novo título",
      content: "Novo conteúdo",
      attachmentsIds: ["1"],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
