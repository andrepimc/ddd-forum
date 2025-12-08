import { Entity } from "../../../../core/entities/entity"
import type { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import type { Optional } from "../../../../core/types/optional"

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updateAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  //getters or acessors
  get content() {
    return this.props.content
  }
  get authorId() {
    return this.props.authorId
  }
  get questionId() {
    return this.props.questionId
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updateAt() {
    return this.props.updateAt
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat("...")
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return answer
  }
}
