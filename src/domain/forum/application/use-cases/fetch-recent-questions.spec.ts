import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { Slug } from "../../enterprise/entities/value-objects/slug"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe("Find many recent questions with pagination", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })
  it("should return recent questions in order", async () => {
    const newQuestion = makeQuestion({
      createdAt: new Date(2025, 12, 20),
    })
    const newQuestion2 = makeQuestion({ createdAt: new Date(2025, 12, 22) })

    inMemoryQuestionsRepository.create(newQuestion)
    inMemoryQuestionsRepository.create(newQuestion2)

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: newQuestion2.createdAt }),
      expect.objectContaining({ createdAt: newQuestion.createdAt }),
    ])
  })
  it("should return recent questions with pagination", async () => {
    for (let i = 1; i <= 22; i++) {
      const newQuestion = makeQuestion()

      inMemoryQuestionsRepository.create(newQuestion)
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toHaveLength(2)
  })
})
