<template>
  <div class="flex gap-3 mb-8">
    <ArtisanEditModal
      v-if="artisan"
      :artisan="artisan"
      @submit-success="handleArtisanUpdated"
    />
    <Button
      v-if="artisan"
      :variant="artisan.isActive ? 'destructive' : 'default'"
      size="sm"
      class="flex items-center gap-2"
      :class="!artisan.isActive ? 'bg-green-600 hover:bg-green-700' : ''"
      @click="handleStatusToggle"
    >
      <XCircle v-if="artisan.isActive" class="h-4 w-4" />
      <CheckCircle v-else class="h-4 w-4" />
      {{ artisan.isActive ? 'Desativar Artesão' : 'Ativar Artesão' }}
    </Button>
  </div>

  <div
    v-if="loading"
    class="flex items-center justify-center py-12"
  >
    <div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle class="h-12 w-12 text-red-500" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Ocorreu um erro ao carregar o artesão
    </h3>
    <p class="text-red-600 mb-4 text-center max-w-md">
      {{ error }}
    </p>
    <Button
      variant="outline"
      @click="retryFetch"
    >
      Tentar Novamente
    </Button>
  </div>

  <div
    v-else-if="artisan"
    class="space-y-6"
  >
    <InfoCard
      title="Informações Pessoais"
      :icon="User"
    >
      <InfoItem
        label="Nome Completo"
        :value="artisan.name"
      />
      <InfoItem
        label="CPF"
        :value="formatCpf(artisan.cpf)"
      />
      <InfoItem
        label="Sexo"
        :value="artisan.sex === 'F' ? 'Feminino' : 'Masculino'"
      />
      <InfoItem
        label="Data de Nascimento"
        :value="formatDate(artisan.birthdate)"
      />
    </InfoCard>

    <InfoCard
      title="Dados Profissionais"
      :icon="Briefcase"
    >
      <InfoItem
        label="Selo Municipal"
        :value="artisan.municipal_seal"
        mono
      />
      <InfoItem
        label="Data de Registro"
        :value="formatDate(artisan.artisan_register_date)"
      />
      <InfoItem
        v-if="artisan.exit_date"
        label="Data de Saída"
        :value="formatDate(artisan.exit_date)"
      />
      <InfoItem
        label="Status"
        variant="badge"
      >
        <Badge variant="default">
          Ativo
        </Badge>
      </InfoItem>
    </InfoCard>

    <InfoCard
      title="Endereço"
      :icon="MapPin"
    >
      <InfoItem
        label="CEP"
        :value="artisan.cep"
        mono
      />
      <InfoItem
        label="Logradouro"
        :value="`${artisan.logradouro}, ${artisan.house_number}`"
      />
      <InfoItem
        label="Bairro"
        :value="artisan.bairro"
      />
      <InfoItem
        label="Cidade/UF"
        :value="`${artisan.localidade} - ${artisan.uf}`"
      />
    </InfoCard>

    <InfoCard
      v-if="artisan.obs"
      title="Observações"
      :icon="FileText"
      class="mb-8"
    >
      <p class="text-gray-700 leading-relaxed">
        {{ artisan.obs }}
      </p>
    </InfoCard>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useArtisans } from '@/composables/useArtisans'
import { Button } from '@/components/ui/button'
import {
  Trash2,
  XCircle,
  CheckCircle,
  User,
  MapPin,
  Briefcase,
  FileText,
  AlertCircle,
} from 'lucide-vue-next'
import { formatCpf, formatDate } from '~/lib/utils'
import InfoCard from '../InfoCard/InfoCard.vue'
import InfoItem from '../InfoCard/InfoItem.vue'
import { Badge } from '@/components/ui/badge'
import { showConfirmDialog, ShowCrudErrorAlert, showSuccessToast } from '~/lib/swal'
import ArtisanEditModal from './ArtisanEditModal.vue'

const route = useRoute()
const router = useRouter()
const { artisan, loading, error, fetchArtisan, deleteArtisan, activateArtisan } = useArtisans()

const retryFetch = () => {
  const artisanId = Number(route.params.id)
  if (!isNaN(artisanId)) {
    fetchArtisan(artisanId)
  }
}

onMounted(() => {
  const artisanId = Number(route.params.id)
  if (!isNaN(artisanId)) {
    fetchArtisan(artisanId)
  }
})

const handleDelete = async () => {
  const artisanId = Number(route.params.id)
  if (isNaN(artisanId)) return

  const result = await showConfirmDialog({
    title: 'Você tem certeza?',
    text: 'Você não poderá reverter esta ação!',
    confirmButtonText: 'Sim, excluir!',
  })

  if (!result) return

  try {
    await deleteArtisan(artisanId)
    showSuccessToast('Artesão excluído com sucesso!')
    router.push('/artisans')
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('artesão', 'excluir', String(err))
  }
}

const getArtisanId = () => Number(route.params.id)

const handleArtisanUpdated = () => {
  const artisanId = getArtisanId()
  if (!isNaN(artisanId)) {
    fetchArtisan(artisanId)
  }
}

const handleStatusToggle = async () => {
  if (!artisan.value) return
  
  const isActive = artisan.value.isActive
  const action = isActive ? 'desativar' : 'ativar'
  
  const result = await showConfirmDialog({
    title: `${isActive ? 'Desativar' : 'Ativar'} Artesão?`,
    text: `O artesão será ${isActive ? 'desativado' : 'ativado'}.`,
    confirmButtonText: `Sim, ${action}!`,
    confirmButtonColor: isActive ? '#d33' : '#16a34a',
  })

  if (!result) return

  try {
    if (isActive) {
      await deleteArtisan(artisan.value.id)
      showSuccessToast('Artesão desativado com sucesso!')
    } else {
      await activateArtisan(artisan.value.id)
      showSuccessToast('Artesão ativado com sucesso!')
    }
    // Refresh artisan data
    fetchArtisan(artisan.value.id)
  } catch (err: unknown) {
    ShowCrudErrorAlert('artesão', action, String(err))
  }
}
</script>
