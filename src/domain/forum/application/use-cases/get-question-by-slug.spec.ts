import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeQuestion } from "../../../../../test/factories/make-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe("Get a question by Slug", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })
  it('should get a question by your slug', async () => {
    const newQuestion = makeQuestion(
      {
        slug: Slug.createFromText('New Title')
      }
    )

    inMemoryQuestionsRepository.create(newQuestion)

    const question = await sut.execute({ slug: "new-title" })

    expect(question.id).toBeTruthy()
    expect(question.title).toEqual(newQuestion.title)
  })
})
