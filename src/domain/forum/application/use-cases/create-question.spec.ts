import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { CreateQuestionUseCase } from "./create-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe("create a Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })
  it("should create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da minha pergunta",
      attachmentsIds: ["1", "2"],
    })

    expect(result.isRight()).toBeTruthy()

    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
    expect(inMemoryQuestionsRepository.items[0]?.attachments).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0]?.attachments).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ])
  })
})
