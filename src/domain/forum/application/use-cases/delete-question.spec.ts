import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { CreateQuestionUseCase } from "./create-question"
import { DeleteQuestionUseCase } from "./delete-question"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe("delete a Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })
  it("should delete a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)
    await sut.execute({ id: "1", authorId: "1" })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })
  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({ id: "1", authorId: "2" })
    }).rejects.toBeInstanceOf(Error)
  })
})
