import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { EditQuestionUseCase } from "./edit-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe("edit a Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })
  it("should save a question correctly", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      id: "1",
      authorId: "1",
      title: "Novo título",
      content: "Novo conteúdo",
    })

    expect(inMemoryQuestionsRepository.items[0]?.title).toEqual("Novo título")
  })
  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        id: "1",
        authorId: "2",
        title: "Novo título",
        content: "Novo conteúdo",
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
