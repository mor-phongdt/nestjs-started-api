echo "-> starting prisma migrations to postgres...\n"
cd /usr/app/
./wait-for.sh db:6000 -- echo "db online\n"
npm run start:migrate:prod
