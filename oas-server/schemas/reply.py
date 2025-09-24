from typing import TypeVar, Generic, Self

from schemas import Schema

T = TypeVar("T")


class Pagination(Schema, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int


class Reply(Schema, Generic[T]):
    code: int = 1
    message: str = ""
    data: T | None = None

    def __init__(self, code: int = 1, message: str = "", data: T | None = None) -> None:
        super().__init__()
        self.code = code
        self.message = message
        self.data = data

    @classmethod
    def succeed(cls, data: T | None = None) -> Self:
        return cls(data=data)

    @classmethod
    def fail(cls, message: str) -> Self:
        return cls(0, message)

    @classmethod
    def paginate(cls, items: T, total: int, page: int = 1, size=10) -> Self:
        return cls(data=Pagination(
            items=items,
            total=total,
            page=page,
            size=size,
        ))
