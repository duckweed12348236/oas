from tortoise import Model
from tortoise.fields import BigIntField, CharField, TextField, DatetimeField, ForeignKeyField, ManyToManyField


class Notice(Model):
    id = BigIntField(primary_key=True, auto_increment=True)
    title = CharField(max_length=100)
    content = TextField()
    release_time = DatetimeField(auto_now_add=True)
    author_id: int
    author = ForeignKeyField("models.User", related_name="notices")
    departments = ManyToManyField("models.Department", related_name="notices")
