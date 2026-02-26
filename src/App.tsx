import styles from './App.module.css'
import { Box, Flex, VStack, HStack, Text, Heading, Image, Link, Button, SimpleGrid } from "@chakra-ui/react"
import { Tooltip } from '@/components/ui/tooltip'
import AvatarImg from "@/assets/profile.jpg"
import { useEffect, useRef, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { FiBriefcase, FiCalendar, FiTool, FiMail, FiPackage, FiGithub, FiExternalLink } from 'react-icons/fi'
import { FaLinkedin } from 'react-icons/fa'
import { SiStripe, SiFirebase, SiGooglecloud, SiAmazonwebservices, SiVite, SiNestjs } from 'react-icons/si'

const ACCENT = "#d66853"
const CARD_BG = "#11151c"
const TEXT_PRIMARY = "#c9d4e3"
const TEXT_SECONDARY = "#7e8fa8"

const SECTION_IDS = {
  EXPERIENCE: 'experience',
  TIMELINE: 'timeline',
  TOOLS: 'tools',
  REPOS: 'repos',
  CONTACT: 'contact',
} as const
type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS]

const NAV_ITEMS: { id: SectionId; icon: React.ElementType; labelKey: string }[] = [
  { id: SECTION_IDS.EXPERIENCE, icon: FiBriefcase, labelKey: 'nav.experience' },
  { id: SECTION_IDS.TIMELINE, icon: FiCalendar, labelKey: 'nav.timeline' },
  { id: SECTION_IDS.TOOLS, icon: FiTool, labelKey: 'nav.tools' },
  { id: SECTION_IDS.REPOS, icon: FiGithub, labelKey: 'nav.repos' },
  { id: SECTION_IDS.CONTACT, icon: FiMail, labelKey: 'nav.contact' },
]

const REPOS_LIST = [
  {
    name: 'know-about-me',
    url: 'https://github.com/Hiru93/know-about-me',
    descKey: 'repos.knowaboutme_desc',
    tech: ['React', 'TypeScript', 'Vite'],
  },
  {
    name: 'mssqlImporter',
    url: 'https://github.com/Hiru93/mssqlImporter',
    descKey: 'repos.mssqlimporter_desc',
    tech: ['Node.js', 'MSSQL', 'CLI'],
  },
  {
    name: 'merger-lg-csv',
    url: 'https://github.com/Hiru93/merger-lg-csv',
    descKey: 'repos.merger_desc',
    tech: ['Node.js', 'CSV'],
  },
]

const TOOLS_LIST = [
  { name: 'Stripe', icon: SiStripe, url: 'https://stripe.com', category: 'tools.cat_payments' },
  { name: 'RevenueCat', icon: FiPackage, url: 'https://www.revenuecat.com', category: 'tools.cat_subscriptions' },
  { name: 'Firebase', icon: SiFirebase, url: 'https://firebase.google.com', category: 'tools.cat_backend_db' },
  { name: 'Google Cloud', icon: SiGooglecloud, url: 'https://cloud.google.com', category: 'tools.cat_cloud' },
  { name: 'AWS', icon: SiAmazonwebservices, url: 'https://aws.amazon.com', category: 'tools.cat_cloud' },
  { name: 'Vite', icon: SiVite, url: 'https://vitejs.dev', category: 'tools.cat_build' },
  { name: 'NestJS', icon: SiNestjs, url: 'https://nestjs.com', category: 'tools.cat_backend_fw' },
]

const COMPANIES: { id: string; name: string }[] = [
  { id: 'exabyte', name: 'Exabyte' },
  { id: 'm31', name: 'M31' },
  { id: 'scai', name: 'SCAI ITEC' },
  { id: 'remedia', name: 'reMedia' },
  { id: 'trizeta', name: 'Trizeta' },
]

function App () {
  const { t, i18n } = useTranslation()
  const [activeSection, setActiveSection] = useState<SectionId>(SECTION_IDS.EXPERIENCE)
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionId, boolean>>({
    experience: false, timeline: false, tools: false, repos: false, contact: false,
  })
  // Track whether we are on a mobile viewport (< 768px = Chakra "md" breakpoint)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const scrollRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // On desktop: observe inside the scrollable right panel.
  // On mobile:  the page itself scrolls, so use the viewport (root: null).
  useEffect(() => {
    const root = isMobile ? null : scrollRef.current
    if (!isMobile && !scrollRef.current) return

    // Fade-in animation: section visible when 15%+ is in view
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setSectionVisibility(prev => ({ ...prev, [entry.target.id as SectionId]: entry.isIntersecting }))
        })
      },
      { root, threshold: 0.15 }
    )

    // Nav highlight: only the section inside the central ~10% band of the viewport is active,
    // so two sections can never be highlighted simultaneously.
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id as SectionId)
        })
      },
      { root, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    Object.values(SECTION_IDS).forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        visibilityObserver.observe(el)
        activeObserver.observe(el)
      }
    })
    return () => {
      visibilityObserver.disconnect()
      activeObserver.disconnect()
    }
  }, [isMobile])

  const sectionStyle = (id: SectionId) => ({
    opacity: sectionVisibility[id] ? 1 : 0,
    transform: sectionVisibility[id] ? 'translateY(0)' : 'translateY(-20px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  })

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Shared nav icon buttons — rendered in both the mobile top bar and the desktop sidebar
  const navIcons = NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => (
    <Tooltip key={id} content={t(labelKey)} showArrow>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => scrollTo(id)}
        color={activeSection === id ? ACCENT : 'whiteAlpha.400'}
        _hover={{ color: ACCENT, bg: 'whiteAlpha.100' }}
        px="3"
        transition="color 0.2s"
      >
        <Icon size={18} />
      </Button>
    </Tooltip>
  ))

  return (
    <Box minH="100vh" w="full" display="flex" justifyContent="center"
      onWheel={(e) => { if (scrollRef.current && !scrollRef.current.contains(e.target as Node)) scrollRef.current.scrollTop += e.deltaY }}
    >
      <Box position="fixed" top="0" left="0" w="100vw" h="100vh" zIndex={-1} className={styles['gradient-background']} />

      {/* ── Mobile: fixed top nav (hidden on md+) ── */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top="4"
        left="50%"
        transform="translateX(-50%)"
        zIndex={100}
        bg="rgba(17, 21, 28, 0.9)"
        backdropFilter="blur(12px)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="#364156"
        px="2" py="2"
      >
        <HStack gap="1">{navIcons}</HStack>
      </Box>

      <Flex
        w="full"
        maxW="1200px"
        direction={{ base: 'column', md: 'row' }}
        h={{ base: 'auto', md: '100vh' }}
        overflow={{ base: 'visible', md: 'hidden' }}
        align={{ base: 'stretch', md: 'start' }}
      >

        {/* ── Left card column ── */}
        <Box
          w={{ base: 'full', md: '340px' }}
          h={{ base: 'auto', md: '100vh' }}
          flexShrink={0}
          px="6"
          pt={{ base: '20', md: '16' }}
        >
          <Box
            bg={CARD_BG}
            borderRadius="xl"
            overflow="hidden"
            w="full"
            className={styles['fade-in']}
          >
            <Image
              src={AvatarImg}
              w="220px"
              h="290px"
              borderRadius="md"
              fit="cover"
              objectPosition="top"
              alt="Foto profilo Mattia Gallinaro"
              mt="8"
              mx="auto"
              display="block"
            />
            <VStack gap="4" textAlign="center" px="6" pt="4" pb="6">
              <Text fontWeight="bold" fontSize="lg" color={ACCENT}>
                Mattia Gallinaro
              </Text>
              <Text fontSize="sm" color={ACCENT} opacity={0.75} lineHeight="tall">
                {t('card.description')}
              </Text>

              {/* LinkedIn */}
              <Link
                href="https://linkedin.com/in/mattiagallinaro"
                target="_blank"
                color={ACCENT}
                opacity={0.8}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s"
              >
                <FaLinkedin size={20} />
              </Link>

              {/* Language switcher */}
              <HStack gap="0" pt="1">
                <Button
                  size="xs" variant="ghost" px="2"
                  color={i18n.language.startsWith('en') ? ACCENT : 'whiteAlpha.400'}
                  fontWeight={i18n.language.startsWith('en') ? 'bold' : 'normal'}
                  onClick={() => i18n.changeLanguage('en')}
                >EN</Button>
                <Text color="whiteAlpha.300" fontSize="xs" userSelect="none">|</Text>
                <Button
                  size="xs" variant="ghost" px="2"
                  color={i18n.language.startsWith('it') ? ACCENT : 'whiteAlpha.400'}
                  fontWeight={i18n.language.startsWith('it') ? 'bold' : 'normal'}
                  onClick={() => i18n.changeLanguage('it')}
                >IT</Button>
              </HStack>
            </VStack>
          </Box>

          {/* ── Desktop nav below card (hidden on mobile) ── */}
          <Box
            display={{ base: 'none', md: 'block' }}
            mt="3"
            bg={CARD_BG}
            borderRadius="xl"
            border="1px solid"
            borderColor="#364156"
            px="2" py="2"
            w="full"
          >
            <HStack gap="1" justify="center">{navIcons}</HStack>
          </Box>
        </Box>

        {/* ── Right panel: scrollable on desktop, natural flow on mobile ── */}
        <Box
          ref={scrollRef}
          flex="1"
          h={{ base: 'auto', md: '100vh' }}
          overflowY={{ base: 'visible', md: 'auto' }}
          css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
        >

          {/* ─── Section 1: Working Experience ─── */}
          <Box id={SECTION_IDS.EXPERIENCE} px={{ base: '5', md: '16' }} pt={{ base: '16', md: '24' }} pb={{ base: '28', md: '48' }}>
            <VStack align="start" gap="10" style={sectionStyle(SECTION_IDS.EXPERIENCE)}>
              <VStack align="start" gap="0">
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="white" lineHeight="1" letterSpacing="tight">
                  {t('hero.title_line1')}
                </Heading>
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="whiteAlpha.300" lineHeight="1" letterSpacing="tight">
                  {t('hero.title_line2')}
                </Heading>
              </VStack>

              <Text color={TEXT_PRIMARY} fontSize={{ base: 'sm', md: 'md' }} maxW="520px" lineHeight="tall">
                {t('hero.description')}
              </Text>

              <HStack gap={{ base: '8', md: '16' }} pt="2">
                <VStack align="start" gap="0">
                  <Text fontSize={{ base: '4xl', md: '6xl' }} fontWeight="bold" color="white" lineHeight="1">{t('stats.years_value')}</Text>
                  <Text fontSize="xs" color={TEXT_SECONDARY} textTransform="uppercase" letterSpacing="widest" pt="1">{t('stats.years_label')}</Text>
                </VStack>
                <VStack align="start" gap="0">
                  <Text fontSize={{ base: '4xl', md: '6xl' }} fontWeight="bold" color="white" lineHeight="1">{t('stats.companies_value')}</Text>
                  <Text fontSize="xs" color={TEXT_SECONDARY} textTransform="uppercase" letterSpacing="widest" pt="1">{t('stats.companies_label')}</Text>
                </VStack>
              </HStack>

              <Box w="full" h="1px" bg="whiteAlpha.100" />

              <VStack gap="8" align="start" maxW="680px">
                <VStack gap="2" align="start">
                  <Text fontSize="xs" color={ACCENT} textTransform="uppercase" letterSpacing="widest" fontWeight="semibold">{t('about.technical_label')}</Text>
                  <Text color={TEXT_PRIMARY} fontSize={{ base: 'sm', md: 'lg' }} lineHeight="1.8">
                    <Trans i18nKey="about.technical_text" components={{ react: <Link href="#" color={ACCENT} />, angular: <Link href="#" color={ACCENT} />, nodejs: <Link href="#" color={ACCENT} /> }} />
                  </Text>
                </VStack>
                <VStack gap="2" align="start">
                  <Text fontSize="xs" color={ACCENT} textTransform="uppercase" letterSpacing="widest" fontWeight="semibold">{t('about.hobbies_label')}</Text>
                  <Text color={TEXT_PRIMARY} fontSize={{ base: 'sm', md: 'lg' }} lineHeight="1.8">{t('about.hobbies_text')}</Text>
                </VStack>
              </VStack>
            </VStack>
          </Box>

          {/* ─── Section 2: 8+ Years of Experience ─── */}
          <Box id={SECTION_IDS.TIMELINE} px={{ base: '5', md: '16' }} pt={{ base: '16', md: '24' }} pb={{ base: '28', md: '48' }}>
            <VStack align="start" gap="10" style={sectionStyle(SECTION_IDS.TIMELINE)}>
              <VStack align="start" gap="0">
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="white" lineHeight="1" letterSpacing="tight">
                  {t('timeline.title_line1')}
                </Heading>
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="whiteAlpha.300" lineHeight="1" letterSpacing="tight">
                  {t('timeline.title_line2')}
                </Heading>
              </VStack>

              <Box w="full" h="1px" bg="whiteAlpha.100" />

              <VStack gap="0" align="start" w="full" maxW="680px">
                {COMPANIES.map((company, i) => (
                  <Flex key={company.id} align="start" gap="6" w="full">
                    {/* Timeline spine */}
                    <Flex direction="column" align="center" flexShrink={0} pt="1">
                      <Box w="2px" h="3" bg={i === 0 ? 'transparent' : '#364156'} />
                      <Box w="3" h="3" borderRadius="full" bg={ACCENT} flexShrink={0} mt="1" />
                      <Box w="2px" flex="1" bg={i === COMPANIES.length - 1 ? 'transparent' : '#364156'} minH="16" />
                    </Flex>
                    {/* Content */}
                    <VStack align="start" gap="1" pb="8">
                      <HStack gap="3" align="baseline" flexWrap="wrap">
                        <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color="white">{company.name}</Text>
                        <Text fontSize="xs" color={TEXT_SECONDARY} textTransform="uppercase" letterSpacing="wide">{t(`timeline.${company.id}_period`)}</Text>
                      </HStack>
                      <Text fontSize="sm" color={ACCENT} fontWeight="medium">{t(`timeline.${company.id}_role`)}</Text>
                      <Text color={TEXT_PRIMARY} fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall">{t(`timeline.${company.id}_desc`)}</Text>
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* ─── Section 3: Most Used Tools ─── */}
          <Box id={SECTION_IDS.TOOLS} px={{ base: '5', md: '16' }} pt={{ base: '16', md: '24' }} pb={{ base: '28', md: '48' }}>
            <VStack align="start" gap="10" style={sectionStyle(SECTION_IDS.TOOLS)}>
              <VStack align="start" gap="0">
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="white" lineHeight="1" letterSpacing="tight">
                  {t('tools.title_line1')}
                </Heading>
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="whiteAlpha.300" lineHeight="1" letterSpacing="tight">
                  {t('tools.title_line2')}
                </Heading>
              </VStack>

              <Box w="full" h="1px" bg="whiteAlpha.100" />

              <SimpleGrid columns={{ base: 1, md: 2 }} gap="4" w="full" maxW="640px">
                {TOOLS_LIST.map(tool => (
                  <Link key={tool.name} href={tool.url} target="_blank" _hover={{ textDecoration: 'none' }} display="flex">
                    <HStack
                      gap="4" px="4" h="80px" w="full"
                      bg="rgba(33, 45, 64, 0.5)"
                      borderRadius="xl"
                      border="1px solid" borderColor="#364156"
                      _hover={{ borderColor: ACCENT, bg: 'rgba(33, 45, 64, 0.85)' }}
                      transition="all 0.2s"
                    >
                      <tool.icon size={32} color={ACCENT} />
                      <VStack align="start" gap="0">
                        <Text fontWeight="semibold" color="white" fontSize="sm">{tool.name}</Text>
                        <Text fontSize="xs" color={TEXT_SECONDARY}>{t(tool.category)}</Text>
                      </VStack>
                    </HStack>
                  </Link>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* ─── Section 4: Personal Repos ─── */}
          <Box id={SECTION_IDS.REPOS} px={{ base: '5', md: '16' }} pt={{ base: '16', md: '24' }} pb={{ base: '28', md: '48' }}>
            <VStack align="start" gap="10" style={sectionStyle(SECTION_IDS.REPOS)}>
              <VStack align="start" gap="0">
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="white" lineHeight="1" letterSpacing="tight">
                  {t('repos.title_line1')}
                </Heading>
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="whiteAlpha.300" lineHeight="1" letterSpacing="tight">
                  {t('repos.title_line2')}
                </Heading>
              </VStack>

              <Box w="full" h="1px" bg="whiteAlpha.100" />

              <VStack gap="4" align="start" w="full" maxW="640px">
                {REPOS_LIST.map(repo => (
                  <Link key={repo.name} href={repo.url} target="_blank" _hover={{ textDecoration: 'none' }} display="flex" w="full">
                    <HStack
                      gap="4" px="5" py="4" w="full"
                      bg="rgba(33, 45, 64, 0.5)"
                      borderRadius="xl"
                      border="1px solid" borderColor="#364156"
                      _hover={{ borderColor: ACCENT, bg: 'rgba(33, 45, 64, 0.85)' }}
                      transition="all 0.2s"
                      align="start"
                    >
                      <Box pt="1" flexShrink={0}>
                        <FiGithub size={24} color={ACCENT} />
                      </Box>
                      <VStack align="start" gap="2" flex="1">
                        <HStack gap="2" justify="space-between" w="full">
                          <Text fontWeight="semibold" color="white" fontSize="md">{repo.name}</Text>
                          <FiExternalLink size={14} color={ACCENT} />
                        </HStack>
                        <Text fontSize="sm" color={TEXT_PRIMARY} lineHeight="tall">{t(repo.descKey)}</Text>
                        <HStack gap="2" flexWrap="wrap">
                          {repo.tech.map(tag => (
                            <Text key={tag} fontSize="xs" color={ACCENT} bg="rgba(214,104,83,0.12)" px="2" py="0.5" borderRadius="md" fontWeight="medium">
                              {tag}
                            </Text>
                          ))}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Link>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* ─── Section 5: Let's Work Together ─── */}
          <Box id={SECTION_IDS.CONTACT} px={{ base: '5', md: '16' }} pt={{ base: '16', md: '24' }} pb={{ base: '28', md: '48' }}>
            <VStack align="start" gap="10" style={sectionStyle(SECTION_IDS.CONTACT)}>
              <VStack align="start" gap="0">
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="white" lineHeight="1" letterSpacing="tight">
                  {t('contact.title_line1')}
                </Heading>
                <Heading fontSize={{ base: '5xl', md: '8xl' }} fontWeight="extrabold" color="whiteAlpha.300" lineHeight="1" letterSpacing="tight">
                  {t('contact.title_line2')}
                </Heading>
              </VStack>

              <Box w="full" h="1px" bg="whiteAlpha.100" />

              <Text color={TEXT_PRIMARY} fontSize={{ base: 'md', md: 'xl' }} lineHeight="1.8" maxW="580px">
                {t('contact.text')}
              </Text>

              <VStack align="start" gap="4">
                <Link href="https://linkedin.com/in/mattiagallinaro" target="_blank" _hover={{ textDecoration: 'none' }}>
                  <HStack gap="3" color={ACCENT} _hover={{ opacity: 0.75 }} transition="opacity 0.2s">
                    <FaLinkedin size={20} />
                    <Text fontWeight="semibold" fontSize={{ base: 'md', md: 'lg' }}>{t('contact.linkedin')}</Text>
                  </HStack>
                </Link>
                <Link href="mailto:mattia.gallinaro93@gmail.com" _hover={{ textDecoration: 'none' }}>
                  <HStack gap="3" color={ACCENT} _hover={{ opacity: 0.75 }} transition="opacity 0.2s">
                    <FiMail size={20} />
                    <Text fontWeight="semibold" fontSize={{ base: 'md', md: 'lg' }}>{t('contact.email')}</Text>
                  </HStack>
                </Link>
              </VStack>
            </VStack>
          </Box>

        </Box>
      </Flex>
    </Box>
  )
}

export default App
