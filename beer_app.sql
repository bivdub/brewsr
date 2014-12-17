
--
-- Data for Name: beer; Type: TABLE DATA; Schema: public; Owner: Bivdub
--

COPY beer (id, dbid, name, "createdAt", "updatedAt") FROM stdin;
3	XAXGgF	Pliny the Elder	2014-12-14 16:33:47.038-08	2014-12-14 16:33:47.038-08
4	WBhrDK	Obsidian Stout	2014-12-14 16:42:48.925-08	2014-12-14 16:42:48.925-08
5	QUqaev	Bourbon County Stout (2014)	2014-12-14 17:16:18.507-08	2014-12-14 17:16:18.507-08
6	c58p4w	Space Dust	2014-12-14 21:35:35.444-08	2014-12-14 21:35:35.444-08
7	PvnMNQ	Space Ghost	2014-12-14 21:35:48.312-08	2014-12-14 21:35:48.312-08
8	KQDQgO	Hoptimum	2014-12-15 09:51:54.324-08	2014-12-15 09:51:54.324-08
9	j2ELdB	Cinder Cone Red	2014-12-15 09:53:45.65-08	2014-12-15 09:53:45.65-08
10	hpYH48	Idiot Sauvin	2014-12-15 09:54:25.622-08	2014-12-15 09:54:25.622-08
11	ERxJb4	New Crustacean Barlywineish Imperial IPA Sorta	2014-12-15 09:54:41.432-08	2014-12-15 09:54:41.432-08
12	Pni8Jo	Hop Stoopid	2014-12-15 13:00:07.752-08	2014-12-15 13:00:07.752-08
13	L7OSOj	Tricerahops Double IPA	2014-12-15 13:00:18.551-08	2014-12-15 13:00:18.551-08
14	7BaMsI	Velvet Merkin	2014-12-15 13:00:29.608-08	2014-12-15 13:00:29.608-08
15	7ojQP8	Double Barrel Ale (DBA)	2014-12-16 14:28:34.872-08	2014-12-16 14:28:34.872-08
16	GWY6vH	§ucaba (Abacus)	2014-12-16 14:28:46.597-08	2014-12-16 14:28:46.597-08
17	evuBoP	Rainier Lager	2014-12-16 14:29:35.964-08	2014-12-16 14:29:35.964-08
18	N8ckRy	Sky Hag	2014-12-16 14:29:56.362-08	2014-12-16 14:29:56.362-08
19	EWlB8A	120 Minute IPA	2014-12-16 14:31:02.9-08	2014-12-16 14:31:02.9-08
20	em9Lxc	Burton Baton	2014-12-16 14:31:17.704-08	2014-12-16 14:31:17.704-08
\.


--
-- Name: beer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Bivdub
--

SELECT pg_catalog.setval('beer_id_seq', 20, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Bivdub
--

COPY users (id, username, email, password, "createdAt", "updatedAt") FROM stdin;
1	BivDub	bivdub@gmail.com	$2a$13$bObrEIrokXq2QaFpzNa2ye63fDFtJSGGyDkffhq/W0U5iuuxxlmAW	2014-12-13 20:45:14.237-08	2014-12-13 20:45:14.237-08
2	example	example@example.org	$2a$13$20rGnur52dNNJVckCw9HO.syLMMz4zIRjjAGL/Z5.fdD8O3KAcWoe	2014-12-14 21:35:02.252-08	2014-12-14 21:35:02.252-08
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Bivdub
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


--
-- Data for Name: usersbeers; Type: TABLE DATA; Schema: public; Owner: Bivdub
--

COPY usersbeers (id, "userId", "beerId", elo, lastrated, "createdAt", "updatedAt") FROM stdin;
9	1	6	1118	1418769184673	2014-12-15 09:54:06.974-08	2014-12-16 14:33:04.676-08
12	1	12	882	1418769184699	2014-12-15 13:00:07.861-08	2014-12-16 14:33:04.7-08
7	1	8	1120	1418769185764	2014-12-15 09:51:54.415-08	2014-12-16 14:33:05.764-08
4	2	3	1000	\N	2014-12-14 21:35:28.173-08	2014-12-14 21:35:28.173-08
5	2	6	1000	\N	2014-12-14 21:35:35.459-08	2014-12-14 21:35:35.459-08
6	2	7	1000	\N	2014-12-14 21:35:48.325-08	2014-12-14 21:35:48.325-08
14	1	14	1000	\N	2014-12-15 13:00:29.62-08	2014-12-15 13:00:29.62-08
2	1	3	1258	1418769185776	2014-12-14 17:16:07.518-08	2014-12-16 14:33:05.777-08
3	1	5	1222	1418769186597	2014-12-14 17:16:18.521-08	2014-12-16 14:33:06.598-08
11	1	11	975	1418769186614	2014-12-15 09:54:41.452-08	2014-12-16 14:33:06.617-08
13	1	13	940	1418769188023	2014-12-15 13:00:18.565-08	2014-12-16 14:33:08.025-08
8	1	9	912	1418769188831	2014-12-15 09:53:45.675-08	2014-12-16 14:33:08.831-08
10	1	10	1099	1418769342595	2014-12-15 09:54:25.641-08	2014-12-16 14:35:42.596-08
1	1	4	1228	1418769342608	2014-12-14 16:42:48.956-08	2014-12-16 14:35:42.609-08
15	1	15	1000	\N	2014-12-16 14:28:34.937-08	2014-12-16 14:28:34.937-08
16	1	16	1000	\N	2014-12-16 14:28:46.617-08	2014-12-16 14:28:46.617-08
17	1	17	1000	\N	2014-12-16 14:29:35.982-08	2014-12-16 14:29:35.982-08
18	1	18	1000	\N	2014-12-16 14:29:56.384-08	2014-12-16 14:29:56.384-08
19	1	19	1000	\N	2014-12-16 14:31:02.91-08	2014-12-16 14:31:02.91-08
20	1	20	1000	\N	2014-12-16 14:31:17.724-08	2014-12-16 14:31:17.724-08
\.


--
-- Name: usersbeers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Bivdub
--

SELECT pg_catalog.setval('usersbeers_id_seq', 20, true);
